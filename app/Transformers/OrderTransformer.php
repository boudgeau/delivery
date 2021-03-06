<?php

namespace CodeDelivery\Transformers;

use CodeDelivery\Models\Client;
use Illuminate\Database\Eloquent\Collection;
use League\Fractal\TransformerAbstract;
use CodeDelivery\Models\Order;

/**
 * Class OrderTransformer
 * @package namespace CodeDelivery\Transformers;
 */
class OrderTransformer extends TransformerAbstract
{
    protected $availableIncludes = ['cupom', 'items', 'client', 'deliveryman'];

    /**
     * Transform the \Order entity
     * @param \Order $model
     *
     * @return array
     */
    public function transform(Order $model)
    {
        return [
            'id' => (int)$model->id,
            'total' => (float)$model->total,
            'status' => (int)$model->status,
            'product_names' => $this->getArrayProductNames($model->items),
            'created_at' => $model->created_at
        ];
    }

    protected function getArrayProductNames(Collection $items)
    {
        $names = [];
        foreach ($items as $item) {
            $names[] = $item->product->name;
        }
        return $names;
    }

    public function includeClient(Order $order)
    {
        return $this->item($order->client, new ClientTransformer());
    }

    public function includeCupom(Order $order)
    {
        if (!$order->cupom) {
            return null;
        }

        return $this->item($order->cupom, new CupomTransformer());
    }

    public function includeItems(Order $order)
    {
        return $this->collection($order->items, new OrderItemTransformer());
    }

    public function includeDeliveryman(Order $order)
    {
        if (!$order->deliveryman) {
            return null;
        }

        return $this->item($order->deliveryman, new DeliverymanTransformer());
    }
}